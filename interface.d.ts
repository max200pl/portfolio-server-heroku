interface WorkUniqueId {
    $oid: string;
}

interface SlideUniqueId {
    $oid: string;
}

interface CategoryUniqueId {
    $oid: string;
}

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
interface Category {
    _id: CategoryUniqueId;
    label: string;
    description?: string;
}

interface Work {
    _id: WorkUniqueId;
    name: string;
    dateFinished: Date;
    category: CategoryUniqueId;
    client?: string;
    link?: string;
    frontTech?: {
        [key: string]: Tech[];
    };
    backTech?: {
        [key: string]: Tech[];
    };
    cardImage?: Image;
    slides?: SlideUniqueId[];
}

interface Slide extends Image {
    _id: SlideUniqueId;
    work: WorkUniqueId;
    order?: number; // specifies the sequence or position of the slide
}
