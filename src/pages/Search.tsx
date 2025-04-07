
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search as SearchIcon } from 'lucide-react';
import { useDebouncedCallback } from '@/hooks/useDebounce';
import { format } from 'date-fns';
import { socket } from '@/lib/socket';

interface QuizGame {
  id: string;
  title: string;
  description: string;
  scheduledStart: string;
  topics: string[];
  questionCount: number;
}

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [quizGames, setQuizGames] = useState<QuizGame[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Get yesterday's date for default filter
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  const todayStr = new Date().toISOString().split('T')[0];

  const [startDateFrom, setStartDateFrom] = useState(yesterdayStr);
  const [startDateTo, setStartDateTo] = useState('');

  // Debounced search function
  const debouncedSearch = useDebouncedCallback((term: string) => {
    fetchQuizGames(term);
  }, 500);

  useEffect(() => {
    fetchQuizGames();
  }, [startDateFrom, startDateTo]);

  const fetchQuizGames = async (term = searchTerm) => {
    setLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (term) params.append('search', term);
      if (startDateFrom) params.append('startDateFrom', startDateFrom);
      if (startDateTo) params.append('startDateTo', startDateTo);

      const response = await fetch(`/api/quizgames?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setQuizGames(data.data);
      } else {
        console.error('Failed to fetch quiz games:', data.message);
      }
    } catch (error) {
      console.error('Error fetching quiz games:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartGame = (gameId: string) => {
    // Emit socket event to start the game
    socket.emit('start_game', { gameId });
    // Navigate to the game page
    navigate('/play');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold">Quiz Games</CardTitle>
          <CardDescription className="text-center">Search for quiz games to play</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by title, description or topic..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>
            <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
              <div>
                <label className="text-sm font-medium">From</label>
                <Input
                  type="date"
                  value={startDateFrom}
                  onChange={(e) => setStartDateFrom(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">To</label>
                <Input
                  type="date"
                  value={startDateTo}
                  onChange={(e) => setStartDateTo(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Topics</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading quiz games...
                  </TableCell>
                </TableRow>
              ) : quizGames.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No quiz games found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                quizGames.map((game) => (
                  <TableRow key={game.id}>
                    <TableCell className="font-medium">{game.title}</TableCell>
                    <TableCell>{game.description || "No description"}</TableCell>
                    <TableCell>
                      {game.scheduledStart ? format(new Date(game.scheduledStart), 'MMM d, yyyy') : "Not scheduled"}
                    </TableCell>
                    <TableCell>
                      {game.topics && game.topics.length > 0
                        ? game.topics.join(', ')
                        : "No topics"}
                    </TableCell>
                    <TableCell>{game.questionCount}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleStartGame(game.id)}>
                        Begin Game
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Search;
