export class Api {
    getData() {
        return new Promise((resolve, reject) => {
            resolve({
                greeting: 'Hello',
                name: 'World'
            });
        });
    }
}
