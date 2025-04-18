import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Login from './components/Login';
import ChaiForm from './components/ChaiForm';
import ChaiMessages from './components/ChaiMessages';
import toast from 'react-hot-toast';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Get session from Supabase auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    // Fetch chai messages
    fetchMessages();

    return () => subscription.unsubscribe();
  }, []);

  // Function to fetch chai messages from Supabase
  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('chai_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load chai messages');
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  // Refresh messages after new chai is added
  const onChaiAdded = () => {
    fetchMessages();
    toast.success('Thank you for the chai! 🎉');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-amber-800">Buy Me a Chai ☕</h1>
          {session && (
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-colors"
            >
              Sign Out
            </button>
          )}
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            {!session ? (
              <Login />
            ) : (
              <ChaiForm session={session} onChaiAdded={onChaiAdded} />
            )}
          </div>

          <div>
            <ChaiMessages messages={messages} />
          </div>
        </main>

        <footer className="mt-12 text-center text-amber-700">
          <p>&copy; {new Date().getFullYear()} Buy Me a Chai. Made with ❤️</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
