package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class GrindingstatusData extends AbstractSeedClass {

    public GrindingstatusData(){
        addIdNameData(1, "Working");
        addIdNameData(2, "Resigned");
        addIdNameData(3, "Suspended");
    }

}