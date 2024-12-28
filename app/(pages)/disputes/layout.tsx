import Navbar from '@/app/components/Navbar';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import Sidebar from '@/app/components/Sidebar';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ProtectedRoute>
        <div className="flex h-screen overflow-hidden w-screen bg-white">
          <Sidebar />
          <main className="flex flex-col h-screen w-full">
            <Navbar />
            <div className="flex-1 overflow-y-auto h-full no-scrollbar">
              <div className="p-5 h-full">{children}</div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    </>
  );
};

export default DashboardLayout;
