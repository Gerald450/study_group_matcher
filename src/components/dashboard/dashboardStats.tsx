

export default function DashboardStats({matches = 0, chats = 0, groups = 0, sessions = 0}){
    return(<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500 ">Study Matches</p>
            <p className="text-2xl font-bold">{matches}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">Active Chats</p>
            <p className="text-2xl font-bold">{chats}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">Study Groups</p>
            <p className="text-2xl font-bold">{groups}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">Study Sessions</p>
            <p className="text-2xl font-bold">{sessions}</p>
        </div>
    </div>)
    
}