class Mapper {

    mapToCanvas(x, y) {
        const realx = x + (width / 2); 
        const realy = y * (-1) + (height / 2)
        return {x: realx, y: realy};  
    }

    mapToCartesian(x, y) {
        const fakex = x - (width / 2); 
        const fakey = (y - (height / 2)) * (-1);
        return {x: fakex, y: fakey};  
    }

}