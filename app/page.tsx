'use client'
import Live from "@/components/Live";
import NavBar from "@/components/Navbar";

export default function Page() {
  return (
    <main className="h-screen overflow-hidden" >
      <NavBar />
      <section className="flex flex-row h-full">
        <Live />
      </section>
    </main>
  );
}
