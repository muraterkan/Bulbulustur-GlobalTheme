// =====================================
// Modal Component - Bulbulustur Theme
// =====================================

export class Modal {
    constructor(selector) {
        this.modal = document.querySelector(selector);
        if (!this.modal) return;

        this.dialog = this.modal.querySelector('.bb-modal-dialog');
        this.closeBtn = this.modal.querySelector('.bb-modal-close');

        this.registerEvents();
    }

    registerEvents() {
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.close();
        });
    }

    open() {
        this.modal.classList.add('active');
        requestAnimationFrame(() => {
            this.dialog.classList.add('show');
        });
    }

    close() {
        this.dialog.classList.remove('show');
        setTimeout(() => {
            this.modal.classList.remove('active');
        }, 200);
    }
}
