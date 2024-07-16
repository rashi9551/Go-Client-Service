function isDistanceUnder100Km(input: string): boolean {

    const kmMatch = input.match(/\b(\d+)\s*km\b/);
    
    if (kmMatch) {
        const distance = parseInt(kmMatch[1], 10);
        console.log(distance,"afdsadsf");
        return distance < 250;
    }
    return false;
}
export default isDistanceUnder100Km