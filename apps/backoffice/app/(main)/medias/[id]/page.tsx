import { getMedia, deleteMedia } from "@/app/api/medias/action";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import { ArrowLeft, Trash, Download, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { MediaUrls } from "./media-urls";

export default async function MediaDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const mediaId = Number(id);

    if (isNaN(mediaId)) {
        notFound();
    }

    let media;
    try {
        media = await getMedia(mediaId);
    } catch (error) {
        notFound();
    }

    if (!media) {
        notFound();
    }

    async function deleteAction() {
        "use server"
        await deleteMedia(mediaId);
        redirect("/medias");
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/medias">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold tracking-tight">Chi tiết Media</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Xem trước</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center items-center bg-muted/20 min-h-[400px] rounded-md p-6">
                        <div className="relative w-full h-full min-h-[400px]">
                            <Image
                                src={media.urlLarge || media.urlOriginal}
                                alt={media.altText || media.name}
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Thông tin</CardTitle>
                        <CardDescription>Chi tiết về tệp tin</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-1">
                            <span className="text-sm font-medium text-muted-foreground">Tên tệp</span>
                            <p className="font-medium break-all">{media.name}</p>
                        </div>

                        <div className="space-y-1">
                            <span className="text-sm font-medium text-muted-foreground">Văn bản thay thế (Alt)</span>
                            <p className="font-medium">{media.altText || "Không có"}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <span className="text-sm font-medium text-muted-foreground">Kích thước</span>
                                <p className="font-medium">{media.size ? (media.size / 1024).toFixed(2) : 0} KB</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-sm font-medium text-muted-foreground">Định dạng</span>
                                <p className="font-medium uppercase">{media.urlOriginal ? media.urlOriginal.split('.').pop() : 'KHÔNG XÁC ĐỊNH'}</p>
                            </div>
                        </div>

                        <Separator />

                        <MediaUrls media={media} />

                        <Separator />

                        <div className="space-y-2">
                            <span className="text-sm font-medium text-muted-foreground">Thao tác nhanh</span>
                            <div className="flex flex-col gap-2">
                                <Button variant="outline" className="w-full justify-start" asChild>
                                    <a href={media.urlOriginal} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="mr-2 h-4 w-4" /> Xem gốc
                                    </a>
                                </Button>
                                <Button variant="outline" className="w-full justify-start" asChild>
                                    <a href={media.urlOriginal} download>
                                        <Download className="mr-2 h-4 w-4" /> Tải xuống
                                    </a>
                                </Button>
                            </div>
                        </div>

                        <Separator />

                        <form action={deleteAction}>
                            <Button variant="destructive" className="w-full" type="submit">
                                <Trash className="mr-2 h-4 w-4" /> Xóa Media
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
