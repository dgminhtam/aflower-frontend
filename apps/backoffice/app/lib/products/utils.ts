import { MultiSelectOption } from "@/components/multiple-select-combobox";
import { Category } from "../categories/definitions";

export function convertCategoriesToMultiSelectOptions(
    categories: Category[] | undefined | null,
    disabledRootId?: number,
    parentDisabled: boolean = false
): MultiSelectOption[] {
    if (!categories || categories.length === 0) {
        return [];
    }
    return categories.map(category => {
        const isDisabled = parentDisabled || (disabledRootId !== undefined && category.id === disabledRootId);
        const transformedChildren = convertCategoriesToMultiSelectOptions(category.children, disabledRootId, isDisabled);
        const option: MultiSelectOption = {
            value: category.id.toString(),
            label: category.name,
            disabled: isDisabled
        };
        if (transformedChildren && transformedChildren.length > 0) {
            option.children = transformedChildren;
        }
        return option;
    });
}