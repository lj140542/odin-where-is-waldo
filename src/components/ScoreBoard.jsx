import { useState, useEffect } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "./ui/table";

export default function ScoreBoard() {
  const [scoreboard, setScoreboard] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const result = await fetch(`${import.meta.env.VITE_API_URL}/leaderboard`, { mode: "cors", method: "GET", })
        .then(response => {
          if (response.ok) return response.json();
        })
        .then(response => {
          return response.leaderboard;
        })
        .catch(error => {
          console.error(error);
        });

      setScoreboard(result);
    }

    fetchData();
  }, []);

  return (
    <div className="w-1/2">
      <h2>SCOREBOARD</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">USERNAME</TableHead>
            <TableHead className="text-center">SCORE</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scoreboard.map((score) =>
            <TableRow key={score._id}>
              <TableCell>{score.username}</TableCell>
              <TableCell>{score.score.replaceAll(':', ' : ')}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}