import http from '../../../common/service/http-common';
import ProcdefDto from '../model/procdef_dto';
import {PageDto} from '../../../common/model/pagination';

class DeploymentService {
    page_query(pg_dto: PageDto<ProcdefDto>) {
        return http.post<PageDto<ProcdefDto>>("/procdef/page_query", pg_dto);
    }
}

export default new DeploymentService();