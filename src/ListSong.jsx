

const ListSong = ({ song }) => {
    // console.log(typeof song);
    // if (!Array.isArray(song)) {
    //     console.log("not an array");
    //     return;
    // }
    console.log("song", song);
    return (
        <div>
            {song && song.map((item) => <div>{item}</div>)}
        </div>
        // data.map((item) => <ListSong song={{ item }} />)
    );
}

export default ListSong;