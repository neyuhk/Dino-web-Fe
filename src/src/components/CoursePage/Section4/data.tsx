interface BlockColor {
    id: number;
    titleBackground: string;
    divBackground: string;
    blockBackground: string;
}

const blockColors: BlockColor[] = [
    {
        id: 1,
        titleBackground: "#877AEF",
        divBackground: "#877AEF",
        blockBackground: "#D6D2FF"
    },
    {
        id: 2,
        titleBackground: "#37796F",
        divBackground: "#37796F",
        blockBackground: "#BFF0DB"
    },
    {
        id: 3,
        titleBackground: "#5388FF",
        divBackground: "#5388FF",
        blockBackground: "#D2DDFF"
    },
    {
        id: 4,
        titleBackground: "#FF2980",
        divBackground: "#FF2980",
        blockBackground: "#F3C5C5"
    }
];

export type { BlockColor };
export default blockColors;