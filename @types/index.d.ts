interface Playlist {
    title: string;
    data: Track[];
}

interface Track {
    url: string;
    title: string;
    artist: string;
    artwork: string;
}

interface PlaylistContext {
    playlist: Playlist[];
    currentIndex: number;
    like: string;
    bookmark: string;
    setPlaylist: (playlist: Playlist[]) => void;
    setCurrentIndex: (index: number) => void;
    setLike: (like: string) => void;
    setBookmark: (bookmark: string) => void;
}