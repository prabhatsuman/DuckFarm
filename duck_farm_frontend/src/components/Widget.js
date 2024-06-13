// src/components/Widget.js
export default function Widget({ title, content }) {
    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-4">{title}</h3>
            <p>{content}</p>
        </div>
    );
}
