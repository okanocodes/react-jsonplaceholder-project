import { useEffect } from "react";

function HomePage() {
  useEffect(() => {
    document.title = "Home Page";
  }, []);
  return (
    <div className="absolute inset-0 flex justify-center items-center">
      <h1 className="text-3xl font-bold">Welcome</h1>
    </div>
  );
}

export default HomePage;
