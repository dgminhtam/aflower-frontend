import { MultiSelectOption } from "@/components/multiple-select-combobox";
import { Category } from "../categories/definitions";

export function convertCategoriesToMultiSelectOptions(
    categories: Category[] | undefined | null
): MultiSelectOption[] {
    if (!categories || categories.length === 0) {
        return [];
    }
    return categories.map(category => {
        const transformedChildren = convertCategoriesToMultiSelectOptions(category.children);
        const option: MultiSelectOption = {
            value: category.id.toString(),
            label: category.name
        };
        if (transformedChildren && transformedChildren.length > 0) {
            option.children = transformedChildren;
        }
        return option;
    });
}