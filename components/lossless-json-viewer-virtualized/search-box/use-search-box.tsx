import { useEffect, useMemo, useState } from "react";

export default function useSearchBox<T>({
    data,
    getMatch,
}: {
    data: T[];
    getMatch: (searchText: string, data: T[]) => T[];
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [highlightIndex, setHighlightIndex] = useState(0);

    const searchMatches = useMemo(
        () => getMatch(searchText, data),
        [getMatch, searchText, data],
    );
    useEffect(() => {
        setHighlightIndex(0);
    }, [data]);

    return {
        isOpen,
        setIsOpen,
        searchText,
        setSearchText,
        highlightIndex,
        setHighlightIndex,
        searchMatches,
    };
}
