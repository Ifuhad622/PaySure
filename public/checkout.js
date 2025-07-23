// MelHad Investment - Checkout JavaScript
class CheckoutManager {
    constructor() {
        this.stripe = null;
        this.elements = null;
        this.cardElement = null;
        this.orderData = null;
        this.currentPaymentMethod = 'card';
        
        this.init();
    }

    async init() {
        // Initialize Stripe
        if (window.Stripe) {
            this.stripe = Stripe('pk_test_YOUR_STRIPE_PUBLISHABLE_KEY'); // Replace with actual key
            this.elements = this.stripe.elements();
            this.setupStripeElements();
        }

        // Load order data from URL params or localStorage
        this.loadOrderData();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Initialize PayPal
        this.initializePayPal();
        
        // Populate order summary
        this.populateOrderSummary();
    }

    loadOrderData() {
        // Get order data from URL parameters or localStorage
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get('order');
        
        if (orderId) {
            // Fetch order data from API
            this.fetchOrderData(orderId);
        } else {
            // Load from localStorage (for new orders)
            const savedOrder = localStorage.getItem('currentOrder');
            if (savedOrder) {
                this.orderData = JSON.parse(savedOrder);
            } else {
                // Demo data
                this.orderData = {
                    orderId: `ORD-${Date.now()}`,
                    items: [
                        {
                            serviceId: 'business-cards',
                            serviceName: 'Business Cards (500 pieces)',
                            quantity: 1,
                            price: 250000,
                            total: 250000
                        },
                        {
                            serviceId: 'logo-design',
                            serviceName: 'Professional Logo Design',
                            quantity: 1,
                            price: 150000,
                            total: 150000
                        }
                    ],
                    totals: {
                        subtotal: 400000,
                        delivery: 25000,
                        tax: 0,
                        total: 425000
                    },
                    customer: {
                        name: '',
                        email: '',
                        phone: ''
                    }
                };
            }
        }
    }

    async fetchOrderData(orderId) {
        try {
            const response = await fetch(`/api/orders/${orderId}`);
            const result = await response.json();
            
            if (result.success) {
                this.orderData = result.order;
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error('Error fetching order data:', error);
            this.showError('Failed to load order data');
        }
    }

    setupStripeElements() {
        if (!this.elements) return;

        // Create card element
        this.cardElement = this.elements.create('card', {
            style: {
                base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                        color: '#aab7c4',
                    },
                },
            },
        });

        this.cardElement.mount('#card-element');

        // Handle real-time validation errors from the card Element
        this.cardElement.on('change', ({error}) => {
            const displayError = document.getElementById('card-errors');
            if (error) {
                displayError.textContent = error.message;
            } else {
                displayError.textContent = '';
            }
        });
    }

    setupEventListeners() {
        // Payment method tabs
        document.querySelectorAll('.payment-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchPaymentMethod(e.target.dataset.method);
            });
        });

        // Payment forms
        document.getElementById('payment-form')?.addEventListener('submit', (e) => {
            this.handleCardPayment(e);
        });

        document.getElementById('mobile-money-form')?.addEventListener('submit', (e) => {
            this.handleMobileMoneyPayment(e);
        });

        document.getElementById('bank-transfer-form')?.addEventListener('submit', (e) => {
            this.handleBankTransferPayment(e);
        });

        // Mobile money provider selection
        document.querySelectorAll('input[name="mobileProvider"]').forEach(radio => {
            radio.addEventListener('change', () => {
                this.updateProcessingFee();
            });
        });
    }

    switchPaymentMethod(method) {
        // Update active tab
        document.querySelectorAll('.payment-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-method="${method}"]`).classList.add('active');

        // Show corresponding content
        document.querySelectorAll('.payment-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${method}-payment`).classList.add('active');

        this.currentPaymentMethod = method;
        this.updateProcessingFee();
    }

    updateProcessingFee() {
        const processingFeeElement = document.getElementById('processing-fee');
        const finalTotalElement = document.getElementById('final-total');
        
        let processingFee = 0;
        const subtotal = this.orderData.totals.subtotal;
        const delivery = this.orderData.totals.delivery;

        switch (this.currentPaymentMethod) {
            case 'card':
                processingFee = Math.round(subtotal * 0.029); // 2.9% for cards
                break;
            case 'mobile-money':
                const selectedProvider = document.querySelector('input[name="mobileProvider"]:checked');
                if (selectedProvider) {
                    const fees = {
                        'orange-money': 0.02,
                        'afrimoney': 0.025,
                        'qmoney': 0.02
                    };
                    processingFee = Math.round(subtotal * (fees[selectedProvider.value] || 0));
                }
                break;
            case 'paypal':
                processingFee = Math.round(subtotal * 0.035); // 3.5% for PayPal
                break;
            case 'bank-transfer':
                processingFee = 0; // No fee for bank transfer
                break;
        }

        const newTotal = subtotal + delivery + processingFee;
        
        processingFeeElement.textContent = `Le ${processingFee.toLocaleString()}`;
        finalTotalElement.textContent = `Le ${newTotal.toLocaleString()}`;
        
        // Update order data
        this.orderData.totals.processingFee = processingFee;
        this.orderData.totals.total = newTotal;
    }

    populateOrderSummary() {
        if (!this.orderData) return;

        // Populate order items
        const orderItemsContainer = document.getElementById('order-items');
        orderItemsContainer.innerHTML = '';

        this.orderData.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'order-item';
            itemElement.innerHTML = `
                <div class="item-details">
                    <h4>${item.serviceName}</h4>
                    <p>Quantity: ${item.quantity}</p>
                </div>
                <div class="item-price">Le ${item.total.toLocaleString()}</div>
            `;
            orderItemsContainer.appendChild(itemElement);
        });

        // Populate totals
        document.getElementById('subtotal').textContent = `Le ${this.orderData.totals.subtotal.toLocaleString()}`;
        document.getElementById('delivery-fee').textContent = `Le ${this.orderData.totals.delivery.toLocaleString()}`;
        
        // Update bank reference
        document.getElementById('bank-reference').textContent = `Order #${this.orderData.orderId}`;
        
        this.updateProcessingFee();
    }

    async handleCardPayment(event) {
        event.preventDefault();
        
        const submitButton = document.getElementById('submit-payment');
        const buttonText = document.getElementById('button-text');
        const spinner = document.getElementById('spinner');
        
        this.setLoading(submitButton, buttonText, spinner, true);

        const customerInfo = {
            name: document.getElementById('customer-name').value,
            email: document.getElementById('customer-email').value,
            phone: document.getElementById('customer-phone').value
        };

        try {
            // Create payment intent
            const response = await fetch('/api/payments/create-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: this.orderData.totals.total,
                    currency: 'usd',
                    orderId: this.orderData.orderId,
                    customerInfo: customerInfo
                })
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message);
            }

            // Confirm payment with Stripe
            const {error} = await this.stripe.confirmCardPayment(result.clientSecret, {
                payment_method: {
                    card: this.cardElement,
                    billing_details: {
                        name: customerInfo.name,
                        email: customerInfo.email,
                        phone: customerInfo.phone
                    }
                }
            });

            if (error) {
                throw new Error(error.message);
            }

            // Payment successful
            this.showSuccessModal({
                orderId: this.orderData.orderId,
                paymentId: result.paymentId,
                amount: this.orderData.totals.total
            });

        } catch (error) {
            console.error('Payment error:', error);
            this.showError(error.message);
        } finally {
            this.setLoading(submitButton, buttonText, spinner, false);
        }
    }

    async handleMobileMoneyPayment(event) {
        event.preventDefault();
        
        const selectedProvider = document.querySelector('input[name="mobileProvider"]:checked');
        if (!selectedProvider) {
            this.showError('Please select a mobile money provider');
            return;
        }

        const customerInfo = {
            name: document.getElementById('mobile-name').value,
            phone: document.getElementById('mobile-phone').value
        };

        this.showLoadingOverlay();

        try {
            const response = await fetch('/api/payments/mobile-money', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: this.orderData.totals.total,
                    provider: selectedProvider.value,
                    phoneNumber: customerInfo.phone,
                    orderId: this.orderData.orderId,
                    customerInfo: customerInfo
                })
            });

            const result = await response.json();

            if (result.success) {
                this.showMobileInstructionsModal(result.instructions, result.paymentId);
            } else {
                throw new Error(result.message);
            }

        } catch (error) {
            console.error('Mobile money payment error:', error);
            this.showError(error.message);
        } finally {
            this.hideLoadingOverlay();
        }
    }

    async handleBankTransferPayment(event) {
        event.preventDefault();
        
        const customerInfo = {
            name: document.getElementById('bank-name').value,
            email: document.getElementById('bank-email').value,
            phone: document.getElementById('bank-phone').value
        };

        this.showLoadingOverlay();

        try {
            // Create order with bank transfer payment method
            const response = await fetch('/api/orders/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customer: customerInfo,
                    items: this.orderData.items,
                    totals: this.orderData.totals,
                    delivery: { method: 'pickup' },
                    payment: { method: 'bank-transfer' },
                    specialInstructions: 'Bank transfer payment - awaiting verification'
                })
            });

            const result = await response.json();

            if (result.success) {
                this.showSuccessModal({
                    orderId: result.orderId,
                    paymentId: 'BANK-' + Date.now(),
                    amount: this.orderData.totals.total,
                    message: 'Order created successfully. We will verify your payment and contact you within 24 hours.'
                });
            } else {
                throw new Error(result.message);
            }

        } catch (error) {
            console.error('Bank transfer error:', error);
            this.showError(error.message);
        } finally {
            this.hideLoadingOverlay();
        }
    }

    initializePayPal() {
        if (window.paypal) {
            paypal.Buttons({
                createOrder: (data, actions) => {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: (this.orderData.totals.total / 12000).toFixed(2) // Convert SLE to USD
                            },
                            description: `MelHad Investment - Order ${this.orderData.orderId}`
                        }]
                    });
                },
                onApprove: async (data, actions) => {
                    const order = await actions.order.capture();
                    
                    // Process PayPal payment
                    await this.processPayPalPayment(order);
                },
                onError: (err) => {
                    console.error('PayPal error:', err);
                    this.showError('PayPal payment failed');
                }
            }).render('#paypal-button-container');
        }
    }

    async processPayPalPayment(paypalOrder) {
        try {
            const customerInfo = {
                name: document.getElementById('paypal-name').value,
                email: document.getElementById('paypal-email').value
            };

            const response = await fetch('/api/payments/paypal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: this.orderData.totals.total,
                    orderId: this.orderData.orderId,
                    customerInfo: customerInfo,
                    paypalOrderId: paypalOrder.id
                })
            });

            const result = await response.json();

            if (result.success) {
                this.showSuccessModal({
                    orderId: this.orderData.orderId,
                    paymentId: result.paymentId,
                    amount: this.orderData.totals.total
                });
            } else {
                throw new Error(result.message);
            }

        } catch (error) {
            console.error('PayPal processing error:', error);
            this.showError(error.message);
        }
    }

    showSuccessModal(paymentInfo) {
        document.getElementById('success-order-id').textContent = paymentInfo.orderId;
        document.getElementById('success-payment-id').textContent = paymentInfo.paymentId;
        document.getElementById('success-amount').textContent = `Le ${paymentInfo.amount.toLocaleString()}`;
        
        document.getElementById('success-modal').classList.remove('hidden');
        
        // Clear order data
        localStorage.removeItem('currentOrder');
    }

    showMobileInstructionsModal(instructions, paymentId) {
        const instructionsList = document.getElementById('mobile-instructions-list');
        instructionsList.innerHTML = '';
        
        instructions.forEach(instruction => {
            const li = document.createElement('li');
            li.textContent = instruction;
            instructionsList.appendChild(li);
        });
        
        document.getElementById('mobile-instructions-modal').classList.remove('hidden');
        
        // Store payment ID for status checking
        this.currentMobilePaymentId = paymentId;
    }

    async checkPaymentStatus() {
        if (!this.currentMobilePaymentId) return;

        this.showLoadingOverlay();

        try {
            const response = await fetch(`/api/payments/status/${this.currentMobilePaymentId}`);
            const result = await response.json();

            if (result.success && result.payment.status === 'completed') {
                this.closeModal();
                this.showSuccessModal({
                    orderId: result.payment.orderId,
                    paymentId: result.payment.paymentId,
                    amount: result.payment.amount
                });
            } else {
                // Payment still pending, show message
                alert('Payment is still being processed. Please wait a moment and try again.');
            }

        } catch (error) {
            console.error('Payment status check error:', error);
            this.showError('Failed to check payment status');
        } finally {
            this.hideLoadingOverlay();
        }
    }

    setLoading(button, textElement, spinner, isLoading) {
        if (isLoading) {
            button.disabled = true;
            textElement.style.display = 'none';
            spinner.classList.remove('hidden');
        } else {
            button.disabled = false;
            textElement.style.display = 'inline';
            spinner.classList.add('hidden');
        }
    }

    showLoadingOverlay() {
        document.getElementById('loading-overlay').classList.remove('hidden');
    }

    hideLoadingOverlay() {
        document.getElementById('loading-overlay').classList.add('hidden');
    }

    showError(message) {
        alert(`Error: ${message}`); // In production, use a better error display
    }

    closeModal() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.add('hidden');
        });
    }
}

// Global functions for modal actions
function downloadReceipt() {
    // Generate and download receipt
    window.open(`/api/receipts/download/${document.getElementById('success-payment-id').textContent}`, '_blank');
}

function redirectToHome() {
    window.location.href = '/';
}

function closeModal() {
    checkout.closeModal();
}

function checkPaymentStatus() {
    checkout.checkPaymentStatus();
}

// Initialize checkout when DOM is loaded
let checkout;
document.addEventListener('DOMContentLoaded', () => {
    checkout = new CheckoutManager();
});

// Handle page unload
window.addEventListener('beforeunload', (e) => {
    // Warn user if they have unsaved payment
    if (checkout && checkout.orderData && !checkout.paymentCompleted) {
        e.preventDefault();
        e.returnValue = '';
    }
});
