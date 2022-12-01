import http from '../../../common/service/http-common';
import ProcdefDto from '../model/procdef_dto';
import {PageDto} from '../../../common/model/pagination';

class ProcdefService {
    page_query(pg_dto: PageDto<ProcdefDto>) {
        return http.post<PageDto<ProcdefDto>>("/procdef/page_query", pg_dto);
    }

    delete_procdef_by_id(procdef_id: string) {
        return http.delete("/procdef/" + procdef_id);
    }
}

export default new ProcdefService();