type ProfileSummaryProps={
    name: string;
    major: string;
    year: string;
    about: string;
    preferences: string[];
}


export default function ProfileSummary({name, major, year, about, preferences}: ProfileSummaryProps){
    return (
        <div className="bg-white p-4 rounded shadow space-y-2">
            <h2 className="font-semibold text-lg">Your Profile Summary</h2>
            <p className="font-bold">{name}</p>
            <p className="text-sm text-gray-600">{major} • {year} </p>
            <p className="text-sm mt-2">{about}</p>
            <div className="flex gap-2 flex-wrap">
                {preferences.map((tag, idx) => (
                    <span key = {idx} className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    )
}