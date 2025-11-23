disabled = { isUploading || !canAddMore || disabled}
multiple
className = "hidden"
    />

    {/* Gallery Grid */ }
{
    uploadedMedia.length > 0 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Bulk Actions */}
            {selectedIds.size > 0 && (
                <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg border border-muted">
                    <span className="text-sm font-medium px-2">{selectedIds.size} selected</span>
                    <Button
                        onClick={handleBulkDelete}
                        variant="destructive"
                        size="sm"
                        className="gap-2 h-8"
                    >
                        <Trash2 className="w-4 h-4" /> Delete Selected
                    </Button>
                </div>
            )}

            {/* Image List */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {uploadedMedia.map((media) => {
                    const isSelected = selectedIds.has(media.id);
                    const isBeingDragged = draggedId === media.id;

                    return (
                        <div
                            key={media.id}
                            draggable={!disabled}
                            onDragStart={(e) => handleDragStart(e, media.id)}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => handleDropImage(media.id)}
                            className={`
                                        relative group aspect-square rounded-lg border overflow-hidden bg-background transition-all duration-200
                                        ${isSelected ? 'ring-2 ring-primary border-primary shadow-sm' : 'border-input hover:border-primary/50'}
                                        ${isBeingDragged ? 'opacity-40 scale-95 grayscale' : 'opacity-100'}
                                    `}
                        >
                            <Image
                                src={media.urlMedium || "/placeholder.svg"}
                                alt="Product image"
                                fill
                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                                className="object-cover"
                            />

                            {/* Controls Overlay */}
                            {!disabled && (
                                <>
                                    {/* Drag Handle */}
                                    <div className={`
                                                absolute inset-0 bg-black/20 backdrop-blur-[1px] transition-opacity flex items-center justify-center cursor-move
                                                ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                                            `}>
                                        <GripVertical className="w-6 h-6 text-white/90 drop-shadow-md" />
                                    </div>

                                    {/* Select Checkbox */}
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); toggleSelect(media.id); }}
                                        className={`
                                                    absolute top-2 left-2 w-6 h-6 rounded border shadow-sm flex items-center justify-center transition-all
                                                    ${isSelected
                                                ? "bg-primary border-primary text-primary-foreground"
                                                : "bg-black/40 border-white/50 hover:bg-black/60"
                                            }
                                                `}
                                    >
                                        {isSelected && <span className="text-xs font-bold">✓</span>}
                                    </button>

                                    {/* Delete Button */}
                                    <Button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); handleRemoveImage(media.id); }}
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2 w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                    >
                                        <X className="w-3 h-3" />
                                    </Button>
                                </>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
        </div >
    )
}