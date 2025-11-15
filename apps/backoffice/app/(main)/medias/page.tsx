
import { getMedias } from "@/app/api/medias/action";
import { buildFilterQuery, buildSortQuery } from "@/app/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import { MediaList } from "./media-list";

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const { page = '0', size = '10', sort = '', ...searchFields } = await searchParams;
    const mediaPage = await getMedias({
        filter: buildFilterQuery(searchFields),
        page: Number(page) - 1,
        size: Number(size),
        sort: buildSortQuery(sort),
    });
    return (
        <Card>
            <CardHeader>
                <CardTitle>Media</CardTitle>
                <CardDescription>Toàn bộ media</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent>
                <MediaList mediaPage={mediaPage} />
            </CardContent>
        </Card>
    );
}
