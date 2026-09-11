export default function FileUpload({ name = 'file', label = 'Upload File', accept = '.pdf,.jpg,.jpeg,.png,.webp', help = 'Format PDF/JPG/PNG, maksimal 5 MB.', error, onChange }) {
    return (
        <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">{label}</label>
            <input type="file" name={name} accept={accept} onChange={onChange} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-[#2563eb] file:px-3 file:py-1.5 file:text-white" />
            {help && <small className="text-xs text-slate-500">{help}</small>}
            {error && <div className="text-xs text-red-600">{error}</div>}
        </div>
    );
}
