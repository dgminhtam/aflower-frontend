import { getProductCollectionById } from "@/app/api/product-collections/action";
import UpdateCollectionForm from "./update-collection-form";

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
    const { id } = await params;
    const collection = await getProductCollectionById(Number(id));

    return <UpdateCollectionForm collection={collection} />;
}
