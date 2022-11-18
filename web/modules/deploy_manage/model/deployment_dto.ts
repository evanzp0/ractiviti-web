import {Dayjs} from "dayjs";

export default interface DeploymentDto {
    id: string | null,
    name: string | null,
    key: string | null,
    organization: string | null,
    deployer: string | null,
    deploy_time_from: Dayjs | number | null,
    deploy_time_to: Dayjs | number | null,
}