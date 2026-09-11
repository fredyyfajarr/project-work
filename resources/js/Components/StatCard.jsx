export default function StatCard({ icon = 'bi-people-fill', label = '-', value = 0, color = 'bg-[#2563eb]' }) {
    return (
        <div className="flex items-center gap-[18px] rounded-3xl bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.05)] transition hover:-translate-y-1">
            <div className={`flex h-[62px] w-[62px] items-center justify-center rounded-[18px] text-2xl text-white ${color}`}>
                <i className={`bi ${icon}`} />
            </div>
            <div>
                <small className="text-slate-500">{label}</small>
                <h3 className="mb-0 text-2xl font-bold text-slate-800">{value}</h3>
            </div>
        </div>
    );
}
