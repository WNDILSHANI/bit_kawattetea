package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class ProductstatusData extends AbstractSeedClass {

    public ProductstatusData(){
        addIdNameData(1, "S");
        addIdNameData(2, "N");
        addIdNameData(3, "R");
    }

}