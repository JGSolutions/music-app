import { Subject } from 'rxjs';

export class PlayerBarService {
    public playerBarChanged = new Subject<string>();

    openPlayerBar(key) {
        this.playerBarChanged.next(key);
    }
}
