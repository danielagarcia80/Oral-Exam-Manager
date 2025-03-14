import { App } from "@/components/App/App";
import { notFound } from "next/navigation";

export default function ModulePage({ params }: { params: { id: string } }) {
    if (!params.id) return notFound();

    return (
        <App>

            <h1>Product ID: {params.id}</h1>;
        </App>
    );
}
