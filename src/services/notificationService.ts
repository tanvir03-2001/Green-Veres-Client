// Notification Service for user-friendly alerts
class NotificationService {
  private static instance: NotificationService;
  private container: HTMLElement | null = null;

  private constructor() {
    this.initContainer();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private initContainer() {
    if (typeof window !== 'undefined') {
      this.container = document.getElementById('notification-container');
      if (!this.container) {
        this.container = document.createElement('div');
        this.container.id = 'notification-container';
        this.container.className = 'fixed top-4 right-4 z-50 space-y-2';
        document.body.appendChild(this.container);
      }
    }
  }

  private createNotification(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration: number = 3000) {
    if (!this.container) return;

    const notification = document.createElement('div');
    const bgColor = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      warning: 'bg-yellow-500',
      info: 'bg-blue-500'
    }[type];

    notification.className = `${bgColor} text-white px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full`;
    notification.innerHTML = `
      <div class="flex items-center justify-between">
        <span>${message}</span>
        <button class="ml-4 text-white hover:text-gray-200 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    `;

    this.container.appendChild(notification);

    // Trigger entrance animation
    setTimeout(() => {
      notification.classList.remove('translate-x-full');
    }, 10);

    // Add close button event listener
    const closeButton = notification.querySelector('button');
    closeButton?.addEventListener('click', () => {
      this.removeNotification(notification);
    });

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        this.removeNotification(notification);
      }, duration);
    }

    return notification;
  }

  private removeNotification(notification: HTMLElement) {
    notification.classList.add('translate-x-full', 'opacity-0');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }

  public showSuccess(message: string, duration?: number) {
    return this.createNotification(message, 'success', duration);
  }

  public showError(message: string, duration?: number) {
    return this.createNotification(message, 'error', duration);
  }

  public showWarning(message: string, duration?: number) {
    return this.createNotification(message, 'warning', duration);
  }

  public showInfo(message: string, duration?: number) {
    return this.createNotification(message, 'info', duration);
  }

  // Specific auth-related notifications
  public showSessionExpired() {
    return this.showError('Your session has expired. Please log in again.', 5000);
  }

  public showTokenRefreshed() {
    return this.showSuccess('Session renewed successfully!', 2000);
  }

  public showNetworkError() {
    return this.showWarning('Network connection lost. Please check your internet connection.', 4000);
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();

// Convenience exports
export const showSuccess = (message: string, duration?: number) => notificationService.showSuccess(message, duration);
export const showError = (message: string, duration?: number) => notificationService.showError(message, duration);
export const showWarning = (message: string, duration?: number) => notificationService.showWarning(message, duration);
export const showInfo = (message: string, duration?: number) => notificationService.showInfo(message, duration);
export const showSessionExpired = () => notificationService.showSessionExpired();
export const showTokenRefreshed = () => notificationService.showTokenRefreshed();
export const showNetworkError = () => notificationService.showNetworkError();