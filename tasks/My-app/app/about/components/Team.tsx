
const teamMembers = [
  {
    name: "John Smith",
    role: "CEO & Founder",
    image: "https://i.pravatar.cc/300?img=12",
  },
  {
    name: "Sarah Johnson",
    role: "UI / UX Designer",
    image: "https://i.pravatar.cc/300?img=32",
  },
  {
    name: "Michael Brown",
    role: "Frontend Developer",
    image: "https://i.pravatar.cc/300?img=15",
  },
  {
    name: "Emily Davis",
    role: "Project Manager",
    image: "https://i.pravatar.cc/300?img=45",
  },
];

export default function Team() {
  return (
    <section className="bg-slate-900 px-6 py-24">

      <div className="mx-auto max-w-7xl">

        <div className="text-center">

          <p className="text-sm font-semibold uppercase tracking-[5px] text-blue-400">
            Our Team
          </p>

          <h2 className="mt-2 text-4xl font-bold">
            Meet Our Experts
          </h2>

          <p className="mt-4 text-gray-400">
            A passionate team dedicated to creating outstanding digital experiences.
          </p>

        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-white/10 bg-slate-800 transition duration-300 hover:-translate-y-2 hover:border-blue-500"
            >

              <img
                src={member.image}
                alt={member.name}
                className="h-72 w-full object-cover"
              />

              <div className="p-6">

                <h3 className="text-xl font-semibold">
                  {member.name}
                </h3>

                <p className="mt-2 text-blue-400">
                  {member.role}
                </p>

              </div>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
}