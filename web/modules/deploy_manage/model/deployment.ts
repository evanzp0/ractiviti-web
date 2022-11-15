export default interface Deployment {
    id: string,
    name: string,
    key: string,
    organization: string,
    deployer: string,
    deploy_time: number,
}