import { Button } from "@workspace/ui/components/button"
import { FileQuestion } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-background p-4">
            <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-muted p-4">
                    <FileQuestion className="h-12 w-12 text-muted-foreground" />
                </div>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">404</h1>
                <div className="space-y-2">
                    <h2 className="text-xl font-semibold tracking-tight">Không tìm thấy trang</h2>
                    <p className="text-muted-foreground max-w-[500px]">
                        Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
                        Vui lòng kiểm tra lại đường dẫn hoặc quay về trang chủ.
                    </p>
                </div>
                <Button asChild className="mt-4">
                    <Link href="/">
                        Trở về trang chủ
                    </Link>
                </Button>
            </div>
        </div>
    )
}
