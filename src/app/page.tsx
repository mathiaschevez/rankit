// import { Suspense } from "react";
// import Rankings from "./components/Rankings";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <NavBar />
      {/* <Suspense fallback={<>loading...</>}>
        <Rankings />
      </Suspense> */}
    </div>
  );
}

function NavBar() {
  return (
    <div>Nav</div>
  )
}