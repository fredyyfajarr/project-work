export default function EmptyState({ title = 'Belum ada data', message = 'Data belum tersedia.', action }) {
    return (
        <div className="py-8 text-center text-slate-500">
            <i className="bi bi-inbox text-4xl text-slate-300" />
            <h4 className="mt-2 font-semibold text-slate-600">{title}</h4>
            <p className="text-sm">{message}</p>
            {action}
        </div>
    );
}
