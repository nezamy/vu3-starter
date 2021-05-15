export function sortBy(transformer = null){
    return (key, order = 'asc') => {
        return (a, b) => {
            if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
                // property doesn't exist on either object
                return 0;
            }
            let varA = a[key];
            let varB = b[key];

            if(transformer && typeof transformer == 'function'){
                varA = transformer(a[key])
                varB = transformer(b[key])
            }
    
            let comparison = 0;
            if (varA > varB) {
                comparison = 1;
            } else if (varA < varB) {
                comparison = -1;
            }
            return (
                (order === 'desc') ? (comparison * -1) : comparison
            );
        };
    }
}