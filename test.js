function getTimeString(time){
    const day = parseInt( time / (3600*24));
    time = time % (3600*24);
    const hour = parseInt( time / (3600));
    time = time % (3600);
    const min = parseInt( time / (60));
    time = time % (60);
    const sec = time;

    return `${day}d ${hour}h ${min}m ${sec}s ago`;
}


console.log(getTimeString(564516));