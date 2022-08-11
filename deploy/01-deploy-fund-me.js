// function deployFunc(){
//     console.log("ho")
// }

const { deployments, network, getNamedAccounts } = require("hardhat")

// const helperConfig = require("../helper-hardhat-config")
// const networkConfig = helperConfig.networkconfig
//the line below will work same as the above 2
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

// module.exports.default = deployFunc

//this is same as above
// module.exports.default =async (hre) => {
//     const {getNamedAccounts, deployments} = hre  //gets the 2 from hre
module.exports = async ({ getNamedAccounts, deployment }) => {
    //same as the above 2 lines
    //hre.getNamedAccounts
    //hre.deployments

    //using deployments object for to get two functions deploy and log
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts() //grabbing deployer from this getNamedAccounts function(used to get named accounts)
    const chainId = network.config.chainId

    //when going for localhost or hardhat network  we want to use a mock

    // const ethUsdPriceFeedAddress   = networkConfig[chainId]["ethUsdPriceFeed"]

    let ethUsdPriceFeedAddress
    if (developmentChains.includes(network.name)) {
        //if we use mock
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        // if we don not use mock
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args, //put pricefeed address
        log: true,
        waitConfirmations: network.config.blockConfirmations,
    })

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, args)
    }
    log("-----------------------------")
}
module.exports.tags = ["all", "fundMe"]
