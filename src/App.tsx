import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router/AppRouter';
import { supabase } from './lib/supabase/client';

function App() {
  useEffect(() => {
    async function testSupabaseConnection() {
      const sessionResult = await supabase.auth.getSession();

      console.log('SUPABASE CONNECTION:', {
        ok: !sessionResult.error,
        session: sessionResult.data.session,
        error: sessionResult.error,
      });

      const roomsResult = await supabase
        .from('rooms')
        .select('*', { count: 'exact' })
        .limit(5);

      console.log('ROOMS TEST:', {
        rows: roomsResult.data,
        count: roomsResult.count,
        error: roomsResult.error,
      });
    }

    testSupabaseConnection();
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
