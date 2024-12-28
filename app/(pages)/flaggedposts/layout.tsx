import Navbar from '@/app/components/Navbar';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import Sidebar from '@/app/components/Sidebar';

const FlaggedPostLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ProtectedRoute>
        <div className="flex h-screen overflow-x-hidden w-screen bg-white">
          <Sidebar />
          <main className="flex flex-col h-screen w-full">
            <Navbar />
            <div className="flex-1 h-full no-scrollbar">
              <div className="p-3 h-full">{children}</div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    </>
  );
};

export default FlaggedPostLayout;
