import Image from 'next/image';

interface TeamMember {
  name: string;
  image: string;
  role: string;
  bio: string;
}

interface TeamMemberProps {
  member: TeamMember;
}

export default function TeamMember({ member }: TeamMemberProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <Image
        src={`/images/team/${member.image}.svg`}
        alt={member.name}
        width={400}
        height={400}
        className="w-full h-64 object-cover"
      />
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
        <p className="text-blue-600 mb-4">{member.role}</p>
        <p className="text-gray-600">{member.bio}</p>
      </div>
    </div>
  );
} 