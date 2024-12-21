interface Tech {
    name: string;
    apply: number;
}

interface Image {
    blurHash: string;
    url: string;
    destination: string;
    size: number;
}

interface Work {
    name: string;
    dateFinished: Date;
    category: string;
    client?: string;
    link?: string;
    frontTech?: {
        [key: string]: Tech[];
    };
    backTech?: {
        [key: string]: Tech[];
    };
    cardImage?: Image;
    images?: Image[];
}
