// BankAccount.java
public class BankAccount {
    protected String accountHolderName;
    protected double balance;

    // Constructor to initialize account holder name and balance
    public BankAccount(String accountHolderName, double initialBalance) {
        this.accountHolderName = accountHolderName;
        if (initialBalance >= 0) {
            this.balance = initialBalance;
        } else {
            this.balance = 0; // Initialize balance to zero if negative value is passed
        }
    }

    // Deposit method
    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
            System.out.println("Deposited " + amount + ". New balance: " + balance);
        } else {
            System.out.println("Deposit amount must be positive.");
        }
    }

    // Withdraw method
    public void withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            System.out.println("Withdrew " + amount + ". New balance: " + balance);
        } else {
            System.out.println("Insufficient funds or invalid amount.");
        }
    }

    // Method to check balance
    public double getBalance() {
        return balance;
    }

    // Method to display account details
    public void displayAccountDetails() {
        System.out.println("Account Holder: " + accountHolderName);
        System.out.println("Balance: " + balance);
    }
}

// SavingsAccount.java (In the same file)
public class SavingsAccount extends BankAccount {
    private double interestRate;

    // Constructor to initialize SavingsAccount with interest rate
    public SavingsAccount(String accountHolderName, double initialBalance, double interestRate) {
        super(accountHolderName, initialBalance);
        this.interestRate = interestRate;
    }

    // Method to calculate and display interest
    public void calculateInterest() {
        double interest = balance * interestRate;
        System.out.println("Interest at " + (interestRate * 100) + "%: " + interest);
        balance += interest; // Add interest to balance
    }

    @Override
    public void displayAccountDetails() {
        super.displayAccountDetails(); // Call base class method
        System.out.println("Interest Rate: " + (interestRate * 100) + "%");
    }

    public static void main(String[] args) {
        // Creating a new BankAccount object
        BankAccount account = new BankAccount("John Doe", 500.0);

        // Displaying account details
        account.displayAccountDetails();

        // Deposit and Withdraw operations
        account.deposit(200);
        account.withdraw(100);
        account.withdraw(700); // Attempting to withdraw more than balance

        // Creating a SavingsAccount object
        SavingsAccount savingsAccount = new SavingsAccount("Jane Smith", 1000.0, 0.03);

        // Displaying account details
        savingsAccount.displayAccountDetails();

        // Deposit, Withdraw and calculate interest
        savingsAccount.deposit(500);
        savingsAccount.withdraw(200);
        savingsAccount.calculateInterest(); // Calculate interest based on current balance
    }
}
