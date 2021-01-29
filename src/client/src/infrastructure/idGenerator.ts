export class IdGenerator {
    private id = 0;

    getNext(): number {
        return this.id++;
    }
}

export const idGenerator = new IdGenerator();
