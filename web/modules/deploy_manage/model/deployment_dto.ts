export default interface DeploymentDto {
    id: string | null,
    name: string | null,
    key: string | null,
    organization: string | null,
    deployer: string | null,
    deploy_time_from: number | string | null,
    deploy_time_to: number | string | null,
}