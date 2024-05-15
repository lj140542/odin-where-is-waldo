import { useState } from "react";
import { useStopwatch } from 'react-timer-hook';
import Button from "./ui/button"

export default function PlayBoard() {
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [coord, setCoord] = useState(null);
  const [characters, setCharacters] = useState([
    { name: "Waldo", img: "waldo.png", found: false },
    { name: "Wizard", img: "wizard.png", found: false },
    { name: "Odlaw", img: "odlaw.png", found: false },
  ]);
  const { seconds, minutes, hours, start, pause } = useStopwatch();

  const getTime = () => `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const getClickCoord = (e) => {
    // Use pixel values to display the popover character choice
    const x = e.pageX - e.target.offsetParent.offsetLeft;
    const y = e.pageY - e.target.offsetParent.offsetTop;
    // Use relative values to know where the player clicked relative to the picture size
    // -> will be sent to the server to check if the user selection is correct
    const relativeX = x / e.target.width * 100;
    const relativeY = y / e.target.height * 100;
    return { x, y, relativeX, relativeY };
  }
  const getIsAllFound = (characters) => {
    let ret = true;
    characters.every(character => {
      ret = character.found;
      return ret; // break the loop if false
    })
    return ret;
  }

  const gameStart = async () => {
    const result = await fetch(`${import.meta.env.VITE_API_URL}/start`, { mode: "cors", method: "POST", credentials: "include", })
      .then(response => {
        if (response.ok) return response.json();
        else return response;
      })
      .catch(error => {
        console.error(error);
        return error;
      })

    if (result.token) {
      setStarted(true);
      start(); // starts the displayed timer
    }
  }
  const gameEnd = async () => {
    pause();

    const result = await fetch(`${import.meta.env.VITE_API_URL}/end`, { mode: "cors", method: "POST", credentials: "include", })
      .then(response => {
        if (response.ok) return response.json();
        else return false;
      })
      .catch(error => {
        console.error(error);
        return false;
      });

    if (result.token) {
      // Display the form to get the user name for the leader board
      setFinished(true);
    }
  }

  const handleHover = (e) => {
    // Handles the hiding of the popover character choice 
    // if the cursor goes beyond the threshold number of pixel
    const threshold = 20;
    const { x, y } = getClickCoord(e);
    if (coord && (Math.abs(x - coord.x) > threshold || Math.abs(y - coord.y) > threshold))
      setCoord(null);
  }
  const handleSelection = async (e, selectionIndex) => {
    // Handles the character selection after clicking on the image

    const formData = {
      charId: "" + selectionIndex,
      coord: {
        x: "" + coord.relativeX,
        y: "" + coord.relativeY
      }
    }

    const isFound = await fetch(`${import.meta.env.VITE_API_URL}/find`, {
      mode: "cors", method: "POST", credentials: "include",
      headers: { "Content-Type": "application/json", },
      body: JSON.stringify(formData),
    })
      .then(response => {
        if (response.ok) return response.json();
        else return false;
      })
      .then(response => {
        return response.result;
      })
      .catch(error => {
        console.error(error);
        return false;
      });

    // flag the selected character as found
    const newCharacter = characters;
    if (isFound && selectionIndex > -1 && selectionIndex < characters.length) {
      newCharacter[selectionIndex].found = true;
      setCharacters(newCharacter);
    }

    // Hide the popover character choice
    setCoord(null);

    // Handle the end of the game if all characters are found
    if (getIsAllFound(newCharacter)) {
      gameEnd()
    }
  }
  const handleScore = async (e) => {
    e.preventDefault()
    const username = e.target.username.value;

    if (username) {
      const result = await fetch(`${import.meta.env.VITE_API_URL}/save`, {
        mode: "cors", method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json", },
        body: JSON.stringify({ username }),
      })
        .then(response => {
          if (response.ok) return response.json();
          else return false;
        })
        .catch(error => {
          console.error(error);
          return false;
        });

      if (result.token) {
        // Refresh the webpage to allow the player to replay and to refresh the leaderboard
        window.location.reload();
      }
    }
  }

  return (
    <div className="flex flex-col max-w-screen-xl w-full py-4 px-6 gap-6 justify-center overflow-scroll lg:flex-row lg:justify-around">
      <div className="flex flex-row lg:flex-col gap-4 justify-around items-center">
        {characters.map((character) =>
          <div className={`flex flex-col justify-center items-center gap-4 ${character.found ? "opacity-30" : ""}`} key={character.name}>
            <img className="max-h-20" src={character.img} alt={character.name} />
            <div className="character-name">{character.name}</div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 relative max-w-screen-lg">
        {!started &&
          <div className="absolute h-full w-full left-0 top-0 flex items-center justify-center backdrop-blur-sm">
            <Button className="bg-accent text-accent-foreground w-32 text-lg shadow-lg" onClick={gameStart}>Start</Button>
          </div>
        }
        {finished &&
          <div className="absolute h-full w-full left-0 top-0 flex items-center justify-center backdrop-blur-sm">
            <form action="POST" onSubmit={handleScore} className="flex flex-col gap-4 justify-between items-center w-max bg-accent/60 p-4 rounded-md">
              <p className="font-medium text-accent-foreground">{getTime()}</p>
              <input id="username" name="username" type="text" placeholder="type your name here"
                className="`flex h-10 w-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-foreground/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
              <Button type="submit" className="bg-background text-foreground w-full text-lg shadow-lg">
                Submit
              </Button>

            </form>
          </div>
        }
        {coord &&
          <div id="character-selection" style={{
            top: coord.y,
            left: coord.x
          }} className="absolute flex flex-col gap-2">
            {characters.map((character, index) =>
              <Button
                key={character.name}
                onClick={(e) => handleSelection(e, index)}
                className="bg-accent text-accent-foreground"
                disabled={character.found ? "disabled" : ""}
              >
                {character.name}
              </Button>
            )
            }
          </div>
        }
        <img className="rounded-sm" src="wiw.png" alt="where is waldo playboard" onClick={(e) => setCoord(getClickCoord(e))} onMouseMove={handleHover} />
        <p>{started ? getTime() : "00:00:00"}</p>
      </div>
    </div>
  )
}