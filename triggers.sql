DELIMITER //

CREATE TRIGGER update_users_balance_after_wallet_insert
AFTER INSERT ON wallet
FOR EACH ROW
BEGIN
    UPDATE users
    SET balance = (
        SELECT SUM(w.balance * c.current_value)
        FROM wallet w
        JOIN currency c ON w.wallet_id = c.wallet_id
        WHERE w.user_id = NEW.user_id
    )
    WHERE user_id = NEW.user_id;
END //

CREATE TRIGGER update_users_balance_after_wallet_update
AFTER UPDATE ON wallet
FOR EACH ROW
BEGIN
    UPDATE users
    SET balance = (
        SELECT SUM(w.balance * c.current_value)
        FROM wallet w
        JOIN currency c ON w.wallet_id = c.wallet_id
        WHERE w.user_id = NEW.user_id
    )
    WHERE user_id = NEW.user_id;
END //

DELIMITER ;
