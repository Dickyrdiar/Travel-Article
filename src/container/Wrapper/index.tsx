import { Outlet } from "react-router-dom";
import { ComplexNavbar } from "../../components/Navbar";

const Wrapper: React.FC = () => {
  return (
    <div>
      <div className="flex h-screen overflow-hidden">
        <div className="relative items-center flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <ComplexNavbar />
          <main>
            <div className="mx-auto py-lg px-sm md:px-lg md:py-xl 2xl:px-xl 2xl:py-2xl mt-[95px]">
              <Outlet />
            </div>

          </main>
        </div>
      </div>
    </div>
  )
}

export default Wrapper