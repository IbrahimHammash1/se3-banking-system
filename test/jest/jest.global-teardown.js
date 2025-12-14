module.exports = async () => {
    console.log("Global teardown: forcing process exit");
    process.exit(0);
};